# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

if !Rails.env.development?
  $stderr.puts "Skipping seed for environment #{Rails.env}"
  return
end

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

def as_ascents(colors)
  all_colors = colors.flat_map do |color, count|
    [color] * count
  end
  all_colors.map.with_index do |color, index|
    seconds = 60 * index
    { color: color, tries: 0, created_at: seconds, completed: true }
  end
end

ascents_data = [
  as_ascents(
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
    ]
  ),
  as_ascents(
    [
      [:white, 7],
      [:green, 3],

      [:white, 1],
      [:green, 1],
      [:white, 2],
      [:green, 1],
      [:white, 5],

      [:white, 9],
    ]
  ),
  [
    {
      color: :orange,
      tries: 0,
      completed: true,
      created_at: 166.244553
    },
    {
      color: :orange,
      tries: 0,
      completed: true,
      created_at: 270.90795
    },
    {
      color: :blue,
      tries: 0,
      completed: true,
      created_at: 318.839196
    },
    {
      color: :white,
      tries: 0,
      completed: true,
      created_at: 367.219306
    },
    {
      color: :white,
      tries: 0,
      completed: true,
      created_at: 443.587042
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 509.822609
    },
    {
      color: :white,
      tries: 0,
      completed: true,
      created_at: 590.79938
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 704.958769
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 769.087091
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 838.013156
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 904.21371
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 1000.785929
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 1339.088466
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 1422.105003
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 1482.117168
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 1608.175893
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 1642.033283
    },
    {
      color: :green,
      tries: 0,
      completed: true,
      created_at: 1749.49377
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 1907.836675
    },
    {
      color: :purple,
      tries: 0,
      completed: true,
      created_at: 2011.103664
    },
    {
      color: :purple,
      tries: 0,
      completed: true,
      created_at: 2119.958186
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 2226.089191
    },
    {
      color: :purple,
      tries: 0,
      completed: true,
      created_at: 2408.220959
    },
    {
      color: :purple,
      tries: 1,
      completed: false,
      created_at: 2773.119634
    },
    {
      color: :green,
      tries: 1,
      completed: true,
      created_at: 3339.823572
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 3410.512982
    },
    {
      color: :yellow,
      tries: 0,
      completed: true,
      created_at: 3488.722517
    },
    {
      color: :purple,
      tries: 3,
      completed: true,
      created_at: 3620.718991
    },
    {
      color: :purple,
      tries: 0,
      completed: true,
      created_at: 4088.689509
    },
    {
      color: :red,
      tries: 0,
      completed: true,
      created_at: 4097.946039
    },
    {
      color: :purple,
      tries: 1,
      completed: true,
      created_at: 4211.8928
    },
    {
      color: :purple,
      tries: 1,
      completed: false,
      created_at: 4329.610159
    },
    {
      color: :red,
      tries: 0,
      completed: true,
      created_at: 4535.376721
    },
    {
      color: :purple,
      tries: 2,
      completed: false,
      created_at: 5033.377582
    },
    {
      color: :purple,
      tries: 0,
      completed: true,
      created_at: 5246.414092
    },
    {
      color: :purple,
      tries: 4,
      completed: true,
      created_at: 5590.692204
    },
    {
      color: :red,
      tries: 1,
      completed: false,
      created_at: 6119.788646
    },
    {
      color: :red,
      tries: 1,
      completed: false,
      created_at: 6126.278614
    }
  ]
]

epoch = Time.zone.parse("2025-01-01 00:00:00")
sessions = 50.times.map do |x|
  {
    user: basic_user,
    description: "session #{x}",
    ascents: ascents_data[x % ascents_data.length].map do |ascent|
      ascent.merge(created_at: epoch + x.days + ascent[:created_at])
    end,
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
