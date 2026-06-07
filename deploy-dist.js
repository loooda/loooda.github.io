import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const repoUrl = process.argv[3] || "https://github.com/loooda/loooda.github.io.git";

if (!token) {
  console.error("❌ Error: Please provide your GitHub Personal Access Token (PAT) as an argument.");
  console.log("Usage: npx tsx deploy-dist.js YOUR_GITHUB_TOKEN [REPO_URL]");
  process.exit(1);
}

async function run() {
  console.log("🚀 Starting automated deployment of BUILT static assets to GitHub...");
  console.log(`📡 Target Repository: ${repoUrl}`);

  try {
    // 1. Compile the project
    console.log("📦 Building application production static files...");
    execSync("npm run build", { stdio: "inherit" });

    // Verify build succeeded
    if (!fs.existsSync("dist")) {
      console.error("❌ Error: dist folder does not exist after build.");
      process.exit(1);
    }

    console.log("✅ Application compiled successfully to './dist/'!");

    // 2. Prepare git repository inside dist
    const distGitdir = path.join("dist", ".git");
    try {
      if (fs.existsSync(distGitdir)) {
        console.log("🧹 Cleaning up old Git directory inside dist...");
        fs.rmSync(distGitdir, { recursive: true, force: true });
      }
    } catch (e) {
      console.log("⚠️ Issue cleaning old Git directory inside dist, continuing:", e.message);
    }

    // Run git init inside dist
    console.log("🔧 Initializing local Git repository inside './dist/'...");
    execSync("git init", { cwd: "dist" });

    const repoOwner = repoUrl.match(/github\.com\/([^/]+)/)?.[1] || "loooda";
    execSync(`git config user.name '${repoOwner}'`, { cwd: "dist" });
    execSync("git config user.email 'shahensheren6@gmail.com'", { cwd: "dist" });

    // Force branch to main
    try {
      execSync("git branch -M main", { cwd: "dist" });
    } catch (e) {
      try {
        execSync("git checkout -b main", { cwd: "dist" });
      } catch (err) {
        // Fallback
      }
    }

    // Add a .nojekyll file to ensure Vite's asset folders starting with underscore (if any) are not ignored by GitHub Pages
    console.log("📄 Writing .nojekyll file inside dist...");
    fs.writeFileSync(path.join("dist", ".nojekyll"), "");

    // Stage all files in dist
    console.log("📂 Staging built files (including index.html, ads.txt, assets, robots.txt)...");
    execSync("git add .", { cwd: "dist" });

    // Commit changes
    try {
      execSync("git commit -m 'Deploy compiled Google-compliant static files with ads.txt 🌐'", { cwd: "dist" });
      console.log("✅ Built files committed successfully.");
    } catch(e) {
      console.log("ℹ️ No new changes inside dist to commit. Continuing...");
    }

    // Configure authenticated remote URL
    console.log("📡 Adding authenticated remote to './dist/'...");
    const authenticatedUrl = repoUrl.replace("https://", `https://${repoOwner}:${token}@`);
    
    try {
      execSync("git remote remove origin", { cwd: "dist" });
    } catch (e) {
      // Ignored if it doesn't exist
    }

    execSync(`git remote add origin ${authenticatedUrl}`, { cwd: "dist" });

    // Push the dist/ directory directly to the main branch of the targeted repo
    console.log("📤 Pushing built assets directly to GitHub (force push)...");
    try {
      execSync("git push -f origin main", { cwd: "dist", stdio: "inherit" });
    } catch (pushErr) {
      console.log("⚠️ Failed to push to main branch, attempting master branch...");
      execSync("git push -f origin master", { cwd: "dist", stdio: "inherit" });
    }

    console.log("\n✨ SUCCESS! Built static files have been deployed to your hub!");
    console.log(`🔗 Accessible URL: https://${repoOwner}.github.io/`);
    console.log(`📁 ads.txt location: https://${repoOwner}.github.io/ads.txt`);
    console.log(`📁 index.html location: https://${repoOwner}.github.io/index.html`);

  } catch (error) {
    console.error("❌ Static Deployment failed with error:", error.message);
    process.exit(1);
  }
}

run();
