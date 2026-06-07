import { execSync } from "child_process";
import fs from "fs";

const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repoUrl = process.argv[3] || "https://github.com/loooda/NdddbNews.git";

if (!token) {
  console.error("❌ Error: Please provide your GitHub Personal Access Token (PAT) as an argument.");
  console.log("Usage: npx tsx deploy-github.js YOUR_GITHUB_TOKEN [REPO_URL]");
  process.exit(1);
}

async function run() {
  console.log("🚀 Starting automated deployment process to GitHub...");
  console.log(`📡 Target Repository: ${repoUrl}`);

  try {
    // Clean and initialize Git
    console.log("🔧 Initializing local Git and configuring workspace defaults...");
    try {
      if (fs.existsSync(".git")) {
        console.log("🧹 Cleaning up old Git directory to purge historical configurations...");
        fs.rmSync(".git", { recursive: true, force: true });
      }
    } catch (e) {
      console.log("⚠️ Issue cleaning .git folder, continuing:", e.message);
    }

    try {
      execSync("git init");
    } catch (e) {
      console.log("⚠️ Git init failed, continuing:", e.message);
    }

    const repoOwner = repoUrl.match(/github\.com\/([^/]+)/)?.[1] || "loooda";
    execSync(`git config user.name '${repoOwner}'`);
    execSync("git config user.email 'shahensheren6@gmail.com'");

    // Set default branch name to main
    try {
      execSync("git branch -M main");
    } catch (e) {
      try {
        execSync("git checkout -b main");
      } catch (err) {
        // Fallback
      }
    }

    // Stage files
    console.log("📂 Staging application workspace files...");
    execSync("git add .");

    // Commit changes
    try {
      execSync("git commit -m 'Deploy complete full-stack codebase of Pulse of the World ✨'");
      console.log("✅ Changes committed successfully.");
    } catch(e) {
      console.log("ℹ️ No new changes to commit to local Git. Continuing...");
    }

    // Configure authenticated remote URL
    console.log("📡 Adding authenticated GitHub remote...");
    const authenticatedUrl = repoUrl.replace("https://", `https://${repoOwner}:${token}@`);
    
    try {
      execSync("git remote remove origin");
    } catch (e) {
      // Ignored if it doesn't exist
    }

    execSync(`git remote add origin ${authenticatedUrl}`);

    // Push code
    console.log("📤 Pushing codebase to GitHub (force push)... This may take a few moments.");
    try {
      execSync("git push -f origin main", { stdio: "inherit" });
    } catch (pushErr) {
      console.log("⚠️ Failed to push to main branch, attempting master branch...");
      execSync("git push -f origin master", { stdio: "inherit" });
    }

    console.log("\n✨ SUCCESS! Your application 'Pulse of the World' has been deployed successfully to GitHub!");
    console.log(`🔗 Access Repository: ${repoUrl}`);

  } catch (error) {
    console.error("❌ Deployment failed with error:", error.message);
    process.exit(1);
  }
}

run();
