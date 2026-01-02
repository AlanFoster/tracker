class PagesController < ApplicationController
  allow_unauthenticated_access only: %i[ home terms privacy ]

  layout 'public'

  def home
    resume_session
    redirect_to sessions_path if Current.user
  end

  def privacy
  end

  def terms
  end
end
