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

type ChatRoom struct {
	ID           uuid.UUID `json:"id"`
	CustomerID   uuid.UUID `json:"customer_id"`
	CustomerName string    `json:"customer_name"`
	CompanyID    uuid.UUID `json:"company_id"`
	CompanyName  string    `json:"company_name"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func DatabaseChatRoomToChatRoom(dbChatRoom database.ChatRoom) ChatRoom {
	return ChatRoom{
		ID:           dbChatRoom.ID,
		CustomerID:   dbChatRoom.CustomerID,
		CustomerName: dbChatRoom.CustomerName,
		CompanyID:    dbChatRoom.CompanyID,
		CompanyName:  dbChatRoom.CompanyName,
		CreatedAt:    dbChatRoom.CreatedAt,
		UpdatedAt:    dbChatRoom.UpdatedAt,
	}
}

func DatabaseChatRoomsToChatRooms(dbChatRooms []database.ChatRoom) []ChatRoom {
	chatrooms := []ChatRoom{}
	for _, dbChatRoom := range dbChatRooms {
		chatrooms = append(chatrooms, DatabaseChatRoomToChatRoom(dbChatRoom))
	}
	return chatrooms
}

type User struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
	Role  string    `json:"role"`
}

type Message struct {
	ID         uuid.UUID `json:"id"`
	ChatRoomID uuid.UUID `json:"chat_room_id"`
	Sender     User      `json:"sender"`
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
		Sender:     User{ID: dbMessage.SenderID, Role: dbMessage.Role},
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
