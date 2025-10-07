package handlers

import (
	"database/sql"
	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
	"time"
)

type Customer struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Country     string    `json:"country"`
	Description *string   `json:"description,omitempty"`
	Photourl    *string   `json:"photourl,omitempty"`
}

func DatabaseCustomerToCustomer(dbCustomer database.Customer) Customer {
	return Customer{
		ID:          dbCustomer.ID,
		Name:        dbCustomer.Name,
		Email:       dbCustomer.Email,
		Country:     dbCustomer.Country,
		Description: &dbCustomer.Description.String,
		Photourl:    &dbCustomer.Photourl.String,
	}
}

type Company struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	Address     string    `json:"address"`
	Description *string   `json:"description,omitempty"`
	Photourl    *string   `json:"photourl,omitempty"`
	Username    *string   `json:"username,omitempty"`
}

func DatabaseCompanyToCompany(dbCompany database.Company) Company {
	return Company{
		ID:          dbCompany.ID,
		Name:        dbCompany.Name,
		Email:       dbCompany.Email,
		Address:     dbCompany.Address,
		Description: &dbCompany.Description.String,
		Photourl:    &dbCompany.Photourl.String,
		Username:    &dbCompany.Username.String,
	}
}

// TODO: Add messages and chat rooms model
type ChatRoom struct {
	ID         uuid.UUID `json:"id"`
	CustomerID uuid.UUID `json:"customer_id"`
	CompanyID  uuid.UUID `json:"company_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func DatabaseChatRoomToChatRoom(dbChatRoom database.ChatRoom) ChatRoom {
	return ChatRoom{
		ID:         dbChatRoom.ID,
		CustomerID: dbChatRoom.CustomerID,
		CompanyID:  dbChatRoom.CompanyID,
		CreatedAt:  dbChatRoom.CreatedAt,
		UpdatedAt:  dbChatRoom.UpdatedAt,
	}
}

func DatabaseChatRoomsToChatRooms(dbChatRooms []database.ChatRoom) []ChatRoom {
	chatrooms := []ChatRoom{}
	for _, dbChatRoom := range dbChatRooms {
		chatrooms = append(chatrooms, DatabaseChatRoomToChatRoom(dbChatRoom))
	}
	return chatrooms
}

// TODO: Add more metadata to chatmessages, sender id, name/username
type Message struct {
	ID         uuid.UUID `json:"id"`
	ChatRoomID uuid.UUID `json:"chat_room_id"`
	SenderID   uuid.UUID `json:"room_id"`
	Content    *string   `json:"content,omitempty"`
	FileUrl    *string   `json:"file_url,omitempty"`
	FileName   *string   `json:"file_name,omitempty"`
	FileSize   *string   `json:"file_size,omitempty"`
	SentAt     sql.NullTime
	IsRead     sql.NullBool
}

func DatabaseMessageToMessage(dbMessage database.Message) Message {
	return Message{
		ID:         dbMessage.ID,
		ChatRoomID: dbMessage.ChatRoomID,
		SenderID:   dbMessage.SenderID,
		Content:    &dbMessage.Content.String,
		FileUrl:    &dbMessage.FileUrl.String,
		FileName:   &dbMessage.FileUrl.String,
		FileSize:   &dbMessage.FileSize.String,
		SentAt:     dbMessage.SentAt,
		IsRead:     dbMessage.IsRead,
	}
}
func DatabaseMessagesToMessages(dbMessages []database.Message) []Message {
	messages := []Message{}
	for _, dbMessage := range dbMessages {
		messages = append(messages, DatabaseMessageToMessage(dbMessage))
	}
	return messages
}
