class SessionsController < ApplicationController
  def index
    @sessions = paginated_sessions
    @show_modal = false
  end

  def show
    @session = Current.user.sessions.find(params[:id])
  end

  def new
    @sessions = paginated_sessions
    @session = Current.user.sessions.build
    @show_modal = true
    render :index
  end

  def create
    @session = Current.user.sessions.build session_params
    @sessions = paginated_sessions
    @show_modal = true
    if @session.save
      redirect_to session_path(@session), notice: 'Session added successfully!'
    else
      flash.now[:postFormErrors] = @session.errors.as_json
      render :index, alert: 'Failed to add session'
    end
  end

  def update
    @session = Current.user.sessions.find(params[:id])
    @sessions = paginated_sessions
    if @session.update session_params
      redirect_to session_path(@session), notice: 'Session updated successfully!'
    else
      flash.now[:postFormErrors] = @ascent.errors.as_json
      render :index, alert: 'Failed to edit session'
    end
  end

  def destroy
    session = Current.user.sessions.where(id: params[:id]).first
    session&.destroy
    redirect_to sessions_path, notice: "Session #{session&.title} deleted successfully!"
  end

  private

  private

  def paginated_sessions
    Current.user
           .sessions
           .order(id: :desc)
           .page(params[:page])
           .per([params.fetch(:per_page, 10).to_i, 100].min)
           .order(created_at: :desc)
  end

  def session_params
    params.require(:session).permit(:description, :intent)
  end
end
