-- Add up migration script here
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER UNSIGNED NOT NULL,
    admin_id INTEGER UNSIGNED,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    status ENUM ('open', 'in_progress', 'closed') NOT NULL,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin (admin_id) ON DELETE CASCADE ON UPDATE CASCADE
);