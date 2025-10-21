package apiutils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func SaveUploadedFile(file multipart.File, filename, destDir string) (string, error) {
	if err := os.MkdirAll(destDir, os.ModePerm); err != nil {
		return "", err
	}
	newName := fmt.Sprintf("%s_%d%s",
		strings.TrimSuffix(filename, filepath.Ext(filename)),
		time.Now().UnixNano(),
		filepath.Ext(filename),
	)
	dstPath := filepath.Join(destDir, newName)

	dst, err := os.Create(dstPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return "", err
	}

	return newName, nil
}
