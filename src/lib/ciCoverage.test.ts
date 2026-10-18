/**
 * Does CI actually run every test this repo has?
 *
 * Three times in one day this ecosystem found the same shape: a gate that
 * enumerates from a hand-written list only ever checks what somebody
 * remembered on the day they wrote it. The site gate had it for founder
 * routes, deploy.sh had it for the files it ships, and the site's own gate
 * runner had it for the gates themselves.
 *
 * A CI workflow is that same list. Adding `test:extraction` tomorrow and not
 * adding a step for it leaves a suite that passes locally, is never run on a
 * push, and quietly stops being a gate. This is the check that notices.
 */
import { readFileSync } from "node:fs";

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) { pass++; console.log(`  ✓  ${name}`); }
  else { fail++; console.log(`  ✗ FAILED  ${name}${detail ? "  -- " + detail : ""}`); }
};

console.log("\n── CI coverage ──\n");

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
const workflow = readFileSync(".github/workflows/ci.yml", "utf8");

// Only what CI RUNS, never what it says about itself. The first version of
// this matched the whole file and failed on a comment explaining that `npx
// tsc` must not be used — a check that cannot tell a prohibition from a
// violation is measuring the wrong thing.
const commands = workflow
  .split("\n")
  .filter((l) => /^\s*(run:|-\s*run:)/.test(l) || /^\s{10,}\S/.test(l))
  .filter((l) => !/^\s*#/.test(l))
  .join("\n");

const testScripts = Object.keys(pkg.scripts).filter((s) => s.startsWith("test:"));
const runInCi = [...commands.matchAll(/npm run ([a-z:]+)/g)].map((m) => m[1]);

ok("the repo has test scripts at all", testScripts.length > 0);

const missed = testScripts.filter((s) => !runInCi.includes(s));
ok("PLANTED every test:* script is run by CI", missed.length === 0,
   `not in ci.yml: ${missed.join(", ")}`);

const ghost = runInCi.filter((s) => !(s in pkg.scripts));
ok("PLANTED CI names no script that does not exist", ghost.length === 0,
   `in ci.yml but not package.json: ${ghost.join(", ")}`);

ok("CI type checks", runInCi.includes("lint"));
ok("CI builds", runInCi.includes("build"));

// npx tsc resolves to a decoy package that prints a banner and exits 0 without
// checking anything. It produced one false "compiles clean" on 2026-10-05.
ok("PLANTED CI never calls the decoy `npx tsc`", !/npx\s+tsc/.test(commands));

console.log(`\n── ${pass}/${pass + fail} passed${fail ? `   ${fail} FAILED` : ""}\n`);
process.exit(fail ? 1 : 0);
