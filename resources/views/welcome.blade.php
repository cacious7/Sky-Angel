<!doctype html>
<html>
<head>
    <title>Sky Angel</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel='stylesheet' href='css/app.css'/>
</head>
<body>
    <div id='sky-angel'></div>
    <script>
        const saveUrl = "{{route('save.player')}}";
        const getPlayersUrl = "{{route('get.players')}}";
    </script>
    <script src='js/app.js'></script>
</body>
</html>