# print in color
function Green
{
    process { Write-Host $_ -ForegroundColor Green }
}


function Red
{
    process { Write-Host $_ -ForegroundColor Red }
}
function Yellow
{
    process { Write-Host $_ -ForegroundColor Yellow }
}

# cast the parameter to int
try{
    $to_kill=[int]$args[0]
    # if nothing is sent as a parameter, then  $to_kill will be 0
    if($to_kill -ne 0) {
        "{0}{1,-15}" -f "[+] Port to be killed: ", $to_kill | Green
        # Splitting the command out-put and getting the last parameter
        #  which specifies the process id of the port to be killed

        # Bad practice - parse a string by findstr and Split it
        # $pid_to_kill=((netstat -aon | findstr $to_kill))
        $pid_to_kill = (Get-NetTCPConnection | Where-Object -Property LocalPort -eq $to_kill | Select-Object -Unique OwningProcess)
        if($pid_to_kill.OwningProcess) {
            "{0}`t{1,-15}" -f "[+] PID to terminate: ", $pid_to_kill.OwningProcess | Green
            taskkill /pid $pid_to_kill.OwningProcess /f    
        }else{
            "{0}{1,-15}" -f "[+] This port is already been terminated ", $to_kill | Yellow
        }
        
    }else{
        "{0}`t{1,-15}{2,-15}" -f "[-] Usage", $MyInvocation.MyCommand.Name, "[--Number]" | Red
    }
}catch {
    # if not a number is sent as an argument
    "{0}`t{1,-15}" -f "[-] Passed parameter is not a number", $args[0] | Red
}
