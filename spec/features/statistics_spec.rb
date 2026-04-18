require "rails_helper"

RSpec.describe "Statistics", type: :feature do
  let!(:user) { FactoryBot.create(:user, :user_pass) }

  def login_as(user)
    page.visit '/'
    click_link 'Sign In'

    fill_in "email_address", with: user.email_address
    fill_in "password", with: 'password123'

    click_button 'Sign in'

    expect(page).to_not have_content 'Sign in'
  end

  def now(message)
    yield
  end

  describe 'viewing statistics' do
    context 'with no data' do
      it 'displays the statistics page' do
        login_as(user)

        now "navigate to statistics" do
          click_link 'Statistics'
          expect(page).to have_content 'Statistics'
        end
      end
    end

    context 'with climbing data' do
      let!(:session1) { FactoryBot.create(:session, user: user, created_at: 3.days.ago) }
      let!(:session2) { FactoryBot.create(:session, user: user, created_at: 1.day.ago) }

      before do
        # Session 1 - 3 days ago
        FactoryBot.create(:ascent, session: session1, color: :red, completed: true, tries: 0, created_at: 3.days.ago)
        FactoryBot.create(:ascent, session: session1, color: :red, completed: true, tries: 1, created_at: 3.days.ago)
        FactoryBot.create(:ascent, session: session1, color: :blue, completed: false, tries: 3, created_at: 3.days.ago)

        # Session 2 - 1 day ago
        FactoryBot.create(:ascent, session: session2, color: :blue, completed: true, tries: 0, created_at: 1.day.ago)
        FactoryBot.create(:ascent, session: session2, color: :white, completed: true, tries: 2, created_at: 1.day.ago)
        FactoryBot.create(:ascent, session: session2, color: :white, completed: false, tries: 5, created_at: 1.day.ago)
      end

      it 'displays statistics with charts and data' do
        login_as(user)

        now "navigate to statistics page" do
          click_link 'Statistics'
          expect(page).to have_content 'Statistics'
        end

        now "verify climbs over time chart shows color data" do
          within '[data-testid="climbs-over-time-chart"]' do
            expect(page).to have_content 'Red'
            expect(page).to have_content 'Blue'
            expect(page).to have_content 'White'
          end
        end
      end
    end

    context 'with multiple sessions across different days' do
      let!(:session1) { FactoryBot.create(:session, user: user, intent: :fun, created_at: 7.days.ago) }
      let!(:session2) { FactoryBot.create(:session, user: user, intent: :volume, created_at: 5.days.ago) }
      let!(:session3) { FactoryBot.create(:session, user: user, intent: :fun, created_at: 2.days.ago) }

      before do
        # Create varied ascent data
        FactoryBot.create(:ascent, session: session1, color: :red, completed: true, tries: 0, created_at: 7.days.ago)
        FactoryBot.create(:ascent, session: session1, color: :blue, completed: true, tries: 1, created_at: 7.days.ago)

        FactoryBot.create(:ascent, session: session2, color: :red, completed: false, tries: 3, created_at: 5.days.ago)
        FactoryBot.create(:ascent, session: session2, color: :white, completed: true, tries: 0, created_at: 5.days.ago)

        FactoryBot.create(:ascent, session: session3, color: :blue, completed: true, tries: 2, created_at: 2.days.ago)
        FactoryBot.create(:ascent, session: session3, color: :white, completed: true, tries: 1, created_at: 2.days.ago)
      end

      it 'displays cumulative data and intent distribution' do
        login_as(user)

        now "navigate to statistics" do
          click_link 'Statistics'
          expect(page).to have_content 'Statistics'
        end

        now "verify climbs over time shows multiple colors" do
          within '[data-testid="climbs-over-time-chart"]' do
            expect(page).to have_content 'Red'
            expect(page).to have_content 'Blue'
            expect(page).to have_content 'White'
          end
        end
      end
    end
  end
end
