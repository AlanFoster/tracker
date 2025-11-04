class SessionsController < ApplicationController
  def index
    @sessions = Session.order(:id).first(5)
    @show_modal = false
  end

  def new
    @sessions = Session.order(:id).first(5)
    @session = Session.new
    @show_modal = true
    render :index
  end

  def show
    @session = Session.find(params[:id])
  end
end
