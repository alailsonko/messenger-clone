package cmd

import "github.com/spf13/cobra"

type Executable interface {
	Execute() error
}

func RunExecutable(factory func(cmd *cobra.Command) (Executable, error)) func(*cobra.Command, []string) error {
	return func(cmd *cobra.Command, args []string) error {
		exec, err := factory(cmd)
		if err != nil {
			return err
		}
		return exec.Execute()
	}
}
