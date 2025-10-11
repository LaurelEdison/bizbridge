-- +goose Up 
CREATE TABLE messages(
id UUID PRIMARY KEY,
chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
sender_id UUID NOT NULL,
role TEXT NOT NULL,
content TEXT,
file_url TEXT,
file_name TEXT,
file_size TEXT,
sent_at TIMESTAMP DEFAULT NOW(),
is_read BOOLEAN DEFAULT false
);
-- +goose Down
DROP TABLE messages;
