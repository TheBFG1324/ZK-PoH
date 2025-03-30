mod routes;
mod controllers;
mod models;
mod utils;

use actix_web::{App, HttpServer, web};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running on 127.0.0.1:8080");
    HttpServer::new(|| {
        App::new()
            .app_data(web::JsonConfig::default().limit(10 * 1024 * 1024))
            .configure(routes::level_check::init_routes)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
