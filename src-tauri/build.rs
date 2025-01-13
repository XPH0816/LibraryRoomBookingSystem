fn main() {
    println!("cargo:rerun-if-changed=.env");

    for item in dotenvy::dotenv_iter().unwrap() {
      let (key, value) = item.unwrap();
      println!("cargo:rustc-env={key}={value}");
    }
    tauri_build::build();
}
