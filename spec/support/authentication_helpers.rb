module AuthenticationHelpers
  def sign_in(user, password: "password123")
    post user_session_path, params: { email_address: user.email_address, password: password }
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelpers, type: :request
end
