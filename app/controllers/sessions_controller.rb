class SessionsController < ApplicationController
  def index
    @sessions = Session.order(id: :desc).first(5)
    @show_modal = false
  end

  def show
    @session = Session.find(params[:id])
  end

  def new
    @sessions = Session.order(id: :desc).first(5)
    @session = Session.new
    @show_modal = true
    render :index
  end

  def create
    @session = Session.new session_params
    @sessions = Session.order(id: :desc).first(5)
    @show_modal = true
    if @session.save
      redirect_to session_path(@session), notice: 'Session added successfully!'
    else
      flash.now[:postFormErrors] = @session.errors.as_json
      render :index, alert: 'Failed to add session'
    end
  end

  def update
    @session = Session.find(params[:id])
    @sessions = Session.order(id: :desc).first(5)
    if @session.update session_params
      redirect_to session_path(@session), notice: 'Session updated successfully!'
    else
      flash.now[:postFormErrors] = @ascent.errors.as_json
      render :index, alert: 'Failed to edit session'
    end
  end

  def destroy
    session = Session.where(id: params[:id]).first
    session.destroy
    redirect_to sessions_path, notice: "Session #{session&.title} deleted successfully!"
  end

  private

  def session_params
    params.require(:session).permit(:description)
  end
end
