class UsersController < ApplicationController
  before_action :set_user, only: [:edit, :update]

  def edit
  end

  def update
    if @user.update user_params
      redirect_to edit_user_url, notice: 'Profile updated successfully!'
    else
      flash.now[:postFormErrors] = @user.errors.as_json
      render :'users/edit', alert: 'Failed to edit profile'
    end
  end

  private

  def set_user
    @user = User.where(id: Current.user.id).includes(:connected_services).first
  end

  def user_params
    params.require(:user).permit(:display_name)
  end
end
