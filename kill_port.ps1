if($args.Count -ne 1) {
    Write-Output "Error"
}
else{
    $port_to_kill=$args[0]
    $data_on_ports=(netstat -aon | findstr $port_to_kill)[0]
    $arr_words=$data_on_ports.Split()
    taskkill /pid $arr_words[$arr_words.Length - 1] /f
}