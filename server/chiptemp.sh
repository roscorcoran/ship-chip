#!/bin/bash

lsb=$(i2cget -y -f 0 0x34 0x5f)
msb=$(i2cget -y -f 0 0x34 0x5e)
bin=$(( $(($msb << 4)) | $(($lsb & 0x0F))))
cel=`echo $bin | awk '{printf("%.0f", ($1/10) - 144.7)}'`

echo "CHIP Temp: $cel°C"
