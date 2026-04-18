# Monitor job performance
ActiveSupport::Notifications.subscribe('perform.active_job') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)
  job_name = event.payload[:job].class.name
  duration = event.duration.round(2)

  Rails.logger.info("Job #{job_name} completed in #{duration}ms")

  # Log slow jobs (over 30 seconds)
  if duration > 30_000
    Rails.logger.warn("Slow job detected: #{job_name} took #{duration}ms")
  end
end
