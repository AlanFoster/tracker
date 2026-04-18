# # Mark existing migrations as safe
# if defined?(StrongMigrations)
#   StrongMigrations.start_after = 20260418231048

#   # Customize error messages
#   StrongMigrations.error_messages[:add_column_default] = "Adding a column with a default value requires rewriting the table. Instead, add the column without a default value, then use change_column_default."

#   # Set statement timeout for migrations (optional)
#   # StrongMigrations.statement_timeout = 1.hour

#   # Disable specific checks if needed (not recommended)
#   # StrongMigrations.enabled_checks = StrongMigrations.enabled_checks - [:add_index]
# end
