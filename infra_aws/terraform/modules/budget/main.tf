resource "aws_budgets_budget" "budget" {
  name         = "infra-budget"
  budget_type  = "COST"
  limit_amount = "15.0"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  tags = {
    name = "${local.project_name}-budget"
  }
}
