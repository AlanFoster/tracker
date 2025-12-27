class Current < ActiveSupport::CurrentAttributes
  attribute :user_session
  delegate :user, to: :user_session, allow_nil: true
end
