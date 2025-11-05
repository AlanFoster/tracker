class AscentsController < ApplicationController
  before_action :set_session!, only: [:new, :edit, :update, :create]

  def new
    @ascent = @session.ascents.new color: @session.ascents.last&.color || Ascent.colors.values[0]
  end

  def edit
    @ascent = @session.ascents.find(params[:id])
  end

  def create
    @ascent = @session.ascents.new ascent_params
    if @ascent.save
      redirect_to session_path(@session), notice: 'Ascent added successfully!'
    else
      flash.now[:postFormErrors] = @ascent.errors.as_json
      render :new, alert: 'Failed to add ascent'
    end
  end

  def update
    @ascent = @session.ascents.find(params[:id])
    if @ascent.update ascent_params
      redirect_to session_path(@session), notice: 'Ascent Updated successfully!'
    else
      flash.now[:postFormErrors] = @ascent.errors.as_json
      render :edit, alert: 'Failed to edit ascent'
    end
  end

  private

  def ascent_params
    params.require(:ascent).permit(:color, :tries)
  end

  def set_session!
    @session = Session.find(params[:session_id])
  end
end
