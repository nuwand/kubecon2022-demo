package services

import (
	"context"
	"fmt"
	"os"

	"github.com/mailgun/mailgun-go/v4"
)

func SendEmail(ctx context.Context, email string) (string, error) {
	mg := mailgun.NewMailgun(os.Getenv("domain"), os.Getenv("apiKey"))

	m := mg.NewMessage(
		fmt.Sprintf("Choreo Task Manager Demo <postmaster@%s>", os.Getenv("domain")),
		"Task Manager Notification",
		"",
		email,
	)
	m.SetTemplate("task-repopened")
	_, id, err := mg.Send(ctx, m)

	return id, err
}
