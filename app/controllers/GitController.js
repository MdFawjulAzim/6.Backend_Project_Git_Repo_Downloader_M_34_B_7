import path from "path";
import fs from "fs";
import { exec } from "child_process";
import util from "util";

//Promisify exec
const execPromise = util.promisify(exec);

export const downloadRepo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    //! GitHub repository URL
    const repoUrl = `https://github.com/${owner}/${repo}.git`;

    // Generate a unique folder name based on timestamp

    const timestamp = Date.now();

    const localFolder = path.join(
      process.cwd(),
      "myRepository",
      `${repo}-${timestamp}`
    );

    // Ensure the folder exists or create it
    if (!fs.existsSync(localFolder)) {
      fs.mkdirSync(localFolder, { recursive: true });
    }

    //wrap the localFolder path in quotes to handle spaces
    const cloneCommand = `git clone ${repoUrl} "${localFolder}"`;

    //execute the clone command
    console.log(`Executing:${cloneCommand}`);
    await execPromise(cloneCommand);

    res
      .status(200)
      .json({ message: `Repository cloned successfully to ${localFolder}` });
  } catch (e) {
    res.status(500).json({
      message: "An error occurred while cloning the repository.",
      error: e.message,
    });
  }
};
