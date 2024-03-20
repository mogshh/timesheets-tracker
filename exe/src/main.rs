// use std::process::{Command, Stdio};
use std::os::windows::process::CommandExt;
//
// const DETACHED_PROCESS: u32 = 0x00000008;
//
// fn main() {
//     Command::new("node")
//         .arg("api/src/main.js")
//         .creation_flags(DETACHED_PROCESS)
//         .stdin(Stdio::null())
//         .stdout(Stdio::null())
//         .stderr(Stdio::null())
//         .spawn()
//         .map_err(|err| println!("{:?}", err))
//         .ok();
//
//     println!("server started");
// }



use std::process::{Command, Stdio};


const CREATE_NEW_PROCESS_GROUP: u32 = 0x00000200;
const CREATE_NO_WINDOW: u32 = 0x08000000;

fn main() {
    Command::new("cmd")
        .args(&["/C", "start", "/k",  "node", "api/src/main.js"])
        .creation_flags(CREATE_NEW_PROCESS_GROUP | CREATE_NO_WINDOW)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start Node.js service");

    println!("Server started");
}
