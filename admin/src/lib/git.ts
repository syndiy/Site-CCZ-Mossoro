import path from "node:path";
import simpleGit from "simple-git";

const git = simpleGit(path.join(process.cwd(), ".."));

export async function commitChange(message: string, files: string[]): Promise<void> {
  try {
    await git.add(files);
    const status = await git.status();
    if (status.staged.length === 0) return;
    await git.commit(message);
  } catch (err) {
    console.error("Falha ao registrar a alteração no histórico:", err);
  }
}
