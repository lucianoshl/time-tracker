script_folder = File.expand_path(File.dirname(__FILE__))

God.watch do |w|
    w.name = "time-tracker"
    w.start = "/home/luciano/Workspace/luciano/time-tracker/bundle/time-tracker-linux-x64/time-tracker"
    w.keepalive
end