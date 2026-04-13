-- Seed Data for Interior Design Project

-- Insert an admin user (Password: admin123)
-- Hash for 'admin123' is $2a$10$x6y4mX8W8.Yf6p.Q6v8o5e
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin', '$2a$10$x6y4mX8W8.Yf6p.Q6v8o5e', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample notifications
INSERT INTO admin_notifications (message, type) 
VALUES ('Welcome to the admin dashboard!', 'system'),
       ('A new user registered.', 'new_user');
