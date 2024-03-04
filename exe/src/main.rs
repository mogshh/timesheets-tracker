use std::process::{Command, Stdio};
use std::os::windows::process::CommandExt;

const DETACHED_PROCESS: u32 = 0x00000008;

fn main() {
    Command::new("node")
        .arg("api/src/main.js")
        .creation_flags(DETACHED_PROCESS)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|err| println!("{:?}", err))
        .ok();

    println!("server started");
}
