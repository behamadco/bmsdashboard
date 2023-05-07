class DeviceCommand{
    _command1="X"
    _command2="X"
    _command3="X"
    _command4="x"
    _data="x"
    _device="x"
    _did=0
    _min=0
    _max=0

    setCommand1(command1){
        this._command1 = command1
    }
    
    setCommand2(command2){
        this._command2 = command2
    }

    setCommand3(command3){
        this._command3 = command3
    }

    setCommand4(command4){
        this._command4 = command4
    }

    setData(data){
        this._data = data;
    }

    setDevice(device){
        this._device = device
    }

    setDid(did){
        this._did = did
    }

    setMin(min){
        this._min = min
    }

    setMax(max){
        this._max = max
    }

    getResponse(){
        var context = {
            "command1":this._command1,
            "command2":this._command2,
            "command3":this._command3,
            "command4":this._command4,
            "device":this._device,
            "data":this._data,
            "did":this._did,
            "min":this._min,
            "max":this._max
        };
        return context
    }
}