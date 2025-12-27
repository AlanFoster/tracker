require "rails_helper"

RSpec.describe OmniAuth::SessionsController, type: :request do
  before do
    OmniAuth.config.test_mode = true
  end

  after do
    OmniAuth.config.mock_auth[:google_oauth2] = nil
    OmniAuth.config.test_mode = false
  end

  describe "GET /auth/unknown_provider/callback" do
    it "rejects unknown providers" do
      get "/auth/unknown_provider/callback"
      expect(response.status).to eq(404)
    end
  end

  describe "GET /auth/google_oauth2/callback" do
    before do
      OmniAuth.config.mock_auth[:google_oauth2] = auth_hash
    end

    context "when the user is persisted" do
      context 'when the user is associated with google_oauth2 auth' do
        let(:auth_hash) do
          OmniAuth::AuthHash.new(
            provider: "google_oauth2",
            uid: user.connected_services.first.uid,
            info: {
              email: user.email_address,
              name: "Test User"
            }
          )
        end

        let!(:user) { FactoryBot.create(:user, :google_oauth2) }

        it "logs in" do
          get "/auth/google_oauth2/callback"
          expect(response).to redirect_to(root_path)
          follow_redirect!
          expect(body).to include(%Q{"displayName":"#{user.display_name}","emailAddress":"#{user.email_address}"})
        end

        it "does not create an additional user" do
          expect { get "/auth/google_oauth2/callback"  }.to_not change { User.count }
        end
      end

      context 'when the user is associated with user/password combo' do
        let(:auth_hash) do
          OmniAuth::AuthHash.new(
            provider: "google_oauth2",
            uid: '12345',
            info: {
              email: user.email_address,
              name: "Test User"
            }
          )
        end

        let!(:user) { FactoryBot.create(:user, :user_pass) }

        it "logs in" do
          get "/auth/google_oauth2/callback"
          expect(response).to redirect_to(new_user_session_path)
          follow_redirect!
          expect(body).to include("The current user is not associated with this provider")
        end

        it "does not create an additional user" do
          expect { get "/auth/google_oauth2/callback"  }.to_not change { User.count }
        end
      end
    end

    context "when the user is not persisted" do
      let(:auth_hash) do
        OmniAuth::AuthHash.new(
          provider: "google_oauth2",
          uid: '1234',
          info: {
            email: 'test@example.com',
            name: "Test User"
          }
        )
      end

      it "logs in" do
        get "/auth/google_oauth2/callback"
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(body).to match(%r{"displayName":"climber-\d+","emailAddress":"test@example.com"})
      end

      it "does creates an additional user" do
        expect { get "/auth/google_oauth2/callback"  }.to change { User.count }.by(1)
      end
    end
  end

  describe "GET /auth/failure" do
    it "redirects to root" do
      get "/auth/failure"
      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
