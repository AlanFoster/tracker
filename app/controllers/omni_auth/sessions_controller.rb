class OmniAuth::SessionsController < ApplicationController
  allow_unauthenticated_access only: [:create, :failure]

  def create
    if Current.user_session.present?
      redirect_to sessions_path
    end

    email = user_info.dig(:info, :email)
    user = User.find_by(email_address: email)

    if user.nil?
      user = create_user
    end

    unless user.connected_services.where(provider: user_info.provider, uid: user_info.uid).any?
      flash[:alert] = "The current user is not associated with this provider"
      redirect_to new_user_session_path
      return
    end

    start_new_session_for user
    redirect_to sessions_path
  end

  def failure
    if params[:message] == "access_denied"
      flash[:alert] = "You cancelled the sign in process. Please try again."
    else
      flash[:alert] = "There was an issue with the sign in process. Please try again."
    end

    redirect_to new_user_session_path
  end

  private

  def user_info
    @user_info ||= request.env['omniauth.auth']
  end

  def set_user
    user = resume_session.try(:user)
    if user.present?
      @user = user
    elsif User.find_by(email_address: user_info.dig(:info, :email).downcase).present?
      service_methods = ConnectedService.where(user_id: User.find_by(email_address: user_info.dig(:info, :email))).pluck(:provider).map(&:to_s).join(", ")
      flash[:notice] = "There's already an account with this email address. Please sign in with it using your #{service_methods} account to associate it with this service."
      redirect_to new_session_path
    else
      @user = create_user
    end
  end

  def create_user
    email = user_info.dig(:info, :email)

    max_retry_attempts = 30
    failure_count = 0

    user = User.build(
      email_address: email,
      display_name: generate_unique_display_name,
    )
    user.connected_services.build(
      provider: user_info.provider,
      uid: user_info.uid,
    )

    loop do
      begin
        user.save!
        return user
      rescue ActiveRecord::RecordNotUnique
        # Attempt a new display name to avoid the record not unique error
        user[:display_name] = generate_unique_display_name
        failure_count += 1
        raise if failure_count >= max_retry_attempts
        retry
      end
    end
  end

  def generate_unique_display_name
    "climber-#{rand(1000..999_999)}"
  end
end
