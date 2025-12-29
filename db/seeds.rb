# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

raise unless Rails.env.development?
_admin = User.find_or_create_by!(email_address: "admin@example.com") do |u|
  u.display_name = "admin"
  u.password = "password"
  u.password_confirmation = "password"
end

basic_user = User.find_or_create_by!(email_address: "user@example.com") do |u|
  u.display_name = "user"
  u.password = "password"
  u.password_confirmation = "password"
end

def as_ascents(colors, base_time)
  all_colors = colors.flat_map do |color, count|
    [color] * count
  end
  all_colors.map.with_index do |color, index|
    { color: color, tries: 0, created_at: base_time + 2.days + index.minutes, completed: true }
  end
end

ascents_data = [
  [
    [:white, 1],
    [:green, 2],
    [:yellow, 1],
    [:green, 1],
    [:yellow, 5],

    [:yellow, 1],
    [:purple, 2],
    [:yellow, 2],
    [:purple, 1],
    [:yellow, 1],
    [:purple, 1],
    [:yellow, 2],

    [:purple, 2],
    [:yellow, 1],
    [:red, 1],
    [:yellow, 1],
    [:purple, 1],
    [:yellow, 2],
  ],
  [
    [:white, 7],
    [:green, 3],

    [:white, 1],
    [:green, 1],
    [:white, 2],
    [:green, 1],
    [:white, 5],

    [:white, 9],
  ],
]

epoch = Time.zone.parse("2025-01-01 00:00:00")
sessions = 50.times.map do |x|
  {
    user: basic_user,
    description: "session #{x}",
    ascents: as_ascents(
      ascents_data[x % ascents_data.length],
      epoch + x.days
    ),
    created_at: epoch + x.days
  }
end

sessions.each do |session|
  session_record = Session.find_or_initialize_by(created_at: session[:created_at])
  session_record.update(session.without(:created_at, :ascents))
  session_record.save!
  session[:ascents].each do |ascent|
    session_record.ascents
                  .find_or_create_by!(tries: 0, completed: true, created_at: ascent[:created_at])
                  .update!(ascent.without(:created_at))
  end
end
