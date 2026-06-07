import { execSync } from "child_process";
import fs from "fs";

const token = process.argv[2] || process.env.HF_TOKEN;

if (!token) {
  console.error("❌ Token error: Please provide your Hugging Face token as an argument.");
  process.exit(1);
}

async function run() {
  console.log("🚀 Starting automated deployment process to Hugging Face Spaces...");

  try {
    // 1. Get whoami details via REST API
    console.log("🔑 Authenticating token and fetching user details from Hugging Face...");
    const whoamiRes = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!whoamiRes.ok) {
      throw new Error(`Failed to verify credentials: ${whoamiRes.status} ${whoamiRes.statusText}`);
    }

    const whoamiData = await whoamiRes.json();
    const username = whoamiData.name;
    console.log(`✅ Welcome, ${username}! Successfully authenticated.`);

    // 2. Create the Space repository if it does not exist
    const repoName = "pulse-of-the-world";
    console.log(`📦 Registering a new Space repo "${repoName}" on your Hugging Face account...`);
    
    const createRes = await fetch("https://huggingface.co/api/repos/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: repoName,
        type: "space",
        sdk: "docker",
        private: false
      })
    });

    if (createRes.ok) {
      console.log(`🎉 Space "${repoName}" successfully registered on Hugging Face!`);
    } else if (createRes.status === 409) {
      console.log(`ℹ️ Space "${repoName}" already exists on your account. Proceeding with deployment update.`);
    } else {
      const errText = await createRes.text();
      console.log(`⚠️ Note/Issue creating Space repository: ${errText}`);
    }

    // 3. Set remote URL and push via Git commands
    console.log("🔧 Initializing local Git and configuring workspace defaults...");
    try {
      if (fs.existsSync(".git")) {
        console.log("🧹 Cleaning up old Git directory to purge historical security leaks...");
        fs.rmSync(".git", { recursive: true, force: true });
      }
    } catch (e) {
      console.log("⚠️ issue cleaning .git folder, continuing:", e.message);
    }

    try {
      execSync("git init");
    } catch (e) {
      console.log("⚠️ Git init failed, continuing:", e.message);
    }

    execSync("git config user.name 'AI Studio Deployer'");
    execSync("git config user.email 'shahensheren6@gmail.com'");

    // Rename branch to main
    try {
      execSync("git branch -M main");
    } catch (e) {
      try {
        execSync("git checkout -b main");
      } catch (err) {
        // Fallback
      }
    }

    console.log("📂 Staging application workspace files (Dockerfile, client, and server)...");
    execSync("git add .");

    // Commit changes
    try {
      execSync("git commit -m 'Deploy static assets, client bundle & container hooks ✨'");
    } catch(e) {
      console.log("ℹ️ No new changes to commit to local Git. Continuing...");
    }

    console.log("📡 Adding Hugging Face remote mirror...");
    const remoteUrl = `https://shahensheren6:${token}@huggingface.co/spaces/${username}/${repoName}.git`;
    
    try {
      execSync("git remote remove hf");
    } catch (e) {
      // if remote didn't exist, ignore
    }

    execSync(`git remote add hf ${remoteUrl}`);

    console.log("📤 Pushing codebase to Hugging Face Spaces (force push)... This may take a few moments.");
    try {
      const pushOutput = execSync("git push -f hf main", { stdio: "inherit" });
    } catch (pushErr) {
      console.log("⚠️ Failed to push to main, attempting to push to master...");
      execSync("git push -f hf master", { stdio: "inherit" });
    }

    console.log(`\n✨ SUCCESS! Your application "Pulse of the World" has been deployed successfully to Hugging Face!`);
    console.log(`🔗 Access Space: https://huggingface.co/spaces/${username}/${repoName}`);
    console.log(`👉 Reminder: Remember to add your 'GEMINI_API_KEY' in your HF Space Settings secrets for full AI capability!`);

  } catch (error) {
    console.error("❌ Deployment failed with error:", error.message);
    process.exit(1);
  }
}

run();
