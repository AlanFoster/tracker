# TODO: There might be security rammifications here
OmniAuth.config.allowed_request_methods = %i[get post]

allowed_providers = %i[]
allowed_providers << :developer if Rails.env.development?

has_google_auth = Rails.app.creds.require(:google, :client_id) && Rails.app.creds.require(:google, :client_secret)
allowed_providers << :google_oauth2 if has_google_auth
Rails.application.config.x.omniauth.allowed_providers = allowed_providers + allowed_providers.map(&:to_s)

Rails.application.config.middleware.use OmniAuth::Builder do
  if allowed_providers.include?(:developer)
    provider :developer
  end

  if allowed_providers.include?(:google_oauth2)
    provider :google_oauth2,
             Rails.app.creds.require(:google, :client_id),
             Rails.app.creds.require(:google, :client_secret),
             scope: "email, profile",
             callback_path: '/auth/google_oauth2/callback',
             request_path: '/auth/google_oauth2'
  end

  OmniAuth.config.on_failure = Proc.new do |env|
    OmniAuth::FailureEndpoint.new(env).redirect_to_failure
  end
end
