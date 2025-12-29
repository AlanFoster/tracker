class AscentsController < ApplicationController
  before_action :set_session!, only: [:new, :edit, :update, :create]

  def new
    @ascent = Ascent.new session: @session,
                         color: @session.ascents.last&.color || Ascent.colors.values[0],
                         completed: true
    @show_ascent_modal = true
    render :'sessions/show'
  end

  def edit
    @ascent = @session.ascents.find(params[:id])
    @show_ascent_modal = true
    render :'sessions/show'
  end

  def create
    @ascent = @session.ascents.new ascent_params
    @show_ascent_modal = true
    if @ascent.save
      redirect_to session_path(@session), notice: "#{@ascent.color} ascent added successfully!"
    else
      flash.now[:postFormErrors] = @ascent.errors.as_json
      render :'sessions/show', alert: 'Failed to add ascent'
    end
  end

  def update
    @ascent = @session.ascents.find(params[:id])
    @show_ascent_modal = true
    if @ascent.update ascent_params
      redirect_to session_path(@session), notice: 'Ascent Updated successfully!'
    else
      flash.now[:postFormErrors] = @ascent.errors.as_json
      render :'sessions/show', alert: 'Failed to edit ascent'
    end
  end

  private

  def ascent_params
    params.require(:ascent).permit(:color, :tries, :completed)
  end

  def set_session!
    @session = Session.find(params[:session_id])
  end
end
