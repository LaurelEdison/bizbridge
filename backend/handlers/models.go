package handlers

import (
	"database/sql"
	"time"

	"github.com/LaurelEdison/bizbridge/internal/database"
	"github.com/google/uuid"
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
func DatabaseCompaniesToCompanies(dbCompanies []database.Company) []Company {
	companies := []Company{}
	for _, dbCompany := range dbCompanies {
		companies = append(companies, DatabaseCompanyToCompany(dbCompany))
	}
	return companies
}

type ChatRoom struct {
	ID               uuid.UUID `json:"id"`
	CustomerID       uuid.UUID `json:"customer_id"`
	CustomerName     string    `json:"customer_name"`
	CompanyID        uuid.UUID `json:"company_id"`
	CompanyName      string    `json:"company_name"`
	CompanyPhotoUrl  *string   `json:"company_photourl,omitempty"`
	CustomerPhotoUrl *string   `json:"customer_photourl,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
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
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Role     string    `json:"role"`
	PhotoUrl *string   `json:"photourl,omitempty"`
}

type Message struct {
	ID         uuid.UUID    `json:"id"`
	ChatRoomID uuid.UUID    `json:"chat_room_id"`
	Sender     User         `json:"sender"`
	Content    *string      `json:"content,omitempty"`
	FileUrl    *string      `json:"file_url,omitempty"`
	FileName   *string      `json:"file_name,omitempty"`
	FileSize   *string      `json:"file_size,omitempty"`
	SentAt     sql.NullTime `json:"sent_at"`
	IsRead     sql.NullBool `json:"is_read"`
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

type ProfileSector struct {
	CompanyID uuid.UUID `json:"company_id"`
	SectorID  uuid.UUID `json:"sector_id"`
}

func DatabaseProfileSectorToProfileSector(dbProfileSector database.ProfileSector) ProfileSector {
	return ProfileSector{
		CompanyID: dbProfileSector.CompanyID,
		SectorID:  dbProfileSector.SectorID,
	}
}
func DatabaseProfileSectorsToProfileSectors(dbProfileSectors []database.ProfileSector) []ProfileSector {
	ProfileSectors := []ProfileSector{}
	for _, dbProfileSector := range dbProfileSectors {
		ProfileSectors = append(ProfileSectors, DatabaseProfileSectorToProfileSector(dbProfileSector))
	}
	return ProfileSectors
}

type Sector struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

func DatabaseSectorToSectors(dbSector database.Sector) Sector {
	return Sector{
		ID:   dbSector.ID,
		Name: dbSector.Name,
	}
}
func DatabaseSectorsToSectors(dbSectors []database.Sector) []Sector {
	sectors := []Sector{}
	for _, dbSector := range dbSectors {
		sectors = append(sectors, DatabaseSectorToSectors(dbSector))
	}
	return sectors
}

type CompanyFile struct {
	ID         uuid.UUID `json:"id"`
	CompanyID  uuid.UUID `json:"company_id"`
	Category   string    `json:"category"`
	FileName   string    `json:"file_name"`
	Url        string    `json:"url"`
	UploadedAt time.Time `json:"uploaded_at"`
}

func DatabaseCompanyFileToCompanyFile(dbCompanyFile database.CompanyFile) CompanyFile {
	return CompanyFile{
		ID:         dbCompanyFile.ID,
		CompanyID:  dbCompanyFile.CompanyID,
		Category:   dbCompanyFile.Category,
		FileName:   dbCompanyFile.FileName,
		Url:        dbCompanyFile.Url,
		UploadedAt: dbCompanyFile.UploadedAt,
	}
}

func DatabaseCompanyFilesToCompanyFiles(dbCompanyFiles []database.CompanyFile) []CompanyFile {
	companyFiles := []CompanyFile{}
	for _, dbCompanyFile := range dbCompanyFiles {
		companyFiles = append(companyFiles, DatabaseCompanyFileToCompanyFile(dbCompanyFile))
	}
	return companyFiles
}

type CustomerFile struct {
	ID         uuid.UUID `json:"id"`
	CustomerID uuid.UUID `json:"customer_id"`
	Category   string    `json:"category"`
	FileName   string    `json:"file_name"`
	Url        string    `json:"url"`
	UploadedAt time.Time `json:"uploaded_at"`
}

func DatabaseCustomerFileToCustomerFile(dbCustomerFile database.CustomerFile) CustomerFile {
	return CustomerFile{
		ID:         dbCustomerFile.ID,
		CustomerID: dbCustomerFile.CustomerID,
		Category:   dbCustomerFile.Category,
		FileName:   dbCustomerFile.FileName,
		Url:        dbCustomerFile.Url,
		UploadedAt: dbCustomerFile.UploadedAt,
	}
}

func DatabaseCustomerFilesToCustomerFIles(dbCustomerFiles []database.CustomerFile) []CustomerFile {
	CustomerFiles := []CustomerFile{}
	for _, dbCustomerFile := range dbCustomerFiles {
		CustomerFiles = append(CustomerFiles, DatabaseCustomerFileToCustomerFile(dbCustomerFile))
	}
	return CustomerFiles
}

type CompanyBanner struct {
	ID         uuid.UUID `json:"id"`
	CompanyID  uuid.UUID `json:"company_id"`
	FileName   string    `json:"file_name"`
	Url        string    `json:"url"`
	UploadedAt time.Time `json:"uploaded_at"`
}

func DatabaseCompanyBannerToCompanyBanner(dbCompanyBanner database.CompanyBanner) CompanyBanner {
	return CompanyBanner{
		ID:         dbCompanyBanner.ID,
		CompanyID:  dbCompanyBanner.CompanyID,
		FileName:   dbCompanyBanner.FileName,
		Url:        dbCompanyBanner.Url,
		UploadedAt: dbCompanyBanner.UploadedAt,
	}
}

func DatabaseCompanyBannersToCompanyBanners(dbCompanyBanners []database.CompanyBanner) []CompanyBanner {
	companyBanners := []CompanyBanner{}
	for _, dbCompanybanner := range dbCompanyBanners {
		companyBanners = append(companyBanners, DatabaseCompanyBannerToCompanyBanner(dbCompanybanner))
	}
	return companyBanners
}

type Wallet struct {
	ID        uuid.UUID `json:"id"`
	OwnerRole string    `json:"owner_role"`
	OwnerID   uuid.UUID `json:"owner_id"`
	Balance   string    `json:"balance"`
	Currency  string    `json:"currency"`
	CreatedAt time.Time `json:"create_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func DatabaseWalletToWallet(dbWallet database.Wallet) Wallet {
	return Wallet{
		ID:        dbWallet.ID,
		OwnerRole: dbWallet.OwnerRole,
		OwnerID:   dbWallet.OwnerID,
		Balance:   dbWallet.Balance,
		Currency:  dbWallet.Currency,
		CreatedAt: dbWallet.CreatedAt,
		UpdatedAt: dbWallet.UpdatedAt,
	}
}

