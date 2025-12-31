file = ARGV[0] or raise "Missing file"
env_var = ARGV[1] or raise "Missing env_var"

env = File.binread(file).lines(chomp: true)
matching_env = env.select { |line| line.start_with?("#{env_var}=") }
if matching_env.empty?
  raise "No matching environment #{env_var} found"
elsif matching_env.size > 1
  raise "Too many matching environment #{env_var} found"
end

value = matching_env.first.split('=', 2)[1]
if value.strip.empty?
  raise "#{env_var} is not set"
end

$stdout.print value
$stdout.flush
