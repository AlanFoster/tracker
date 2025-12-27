Rails.application.routes.draw do
  # Authentication
  resource :user_session
  resources :passwords, param: :token
  # oauth callbacks
  ALLOWED_OMNIAUTH_PROVIDERS = [
    'google_oauth2'
  ]
  get "auth/:provider/callback",
      to: "omni_auth/sessions#create",
      constraints: ->(req) {
        Rails.application.config.x.omniauth.allowed_providers.include?(req.params[:provider])
      }
  get "auth/failure", to: "omni_auth/sessions#failure"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root 'sessions#index'
  resources :sessions, only: [:index, :new, :create, :show, :destroy] do
    resources :ascents, only: [:new, :edit, :create, :update]
  end

  resource :user
end
