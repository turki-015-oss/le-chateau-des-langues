package com.lechateau.langues;

import android.hardware.GeomagneticField;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TrueNorth")
public class TrueNorthPlugin extends Plugin {
    @PluginMethod
    public void getDeclination(PluginCall call) {
        Double latitude = call.getDouble("latitude");
        Double longitude = call.getDouble("longitude");
        Double altitude = call.getDouble("altitude", 0.0);
        Double timestamp = call.getDouble("timestamp", (double) System.currentTimeMillis());

        if (latitude == null || longitude == null) {
            call.reject("Latitude and longitude are required.");
            return;
        }

        GeomagneticField field = new GeomagneticField(
            latitude.floatValue(),
            longitude.floatValue(),
            altitude.floatValue(),
            timestamp.longValue()
        );
        JSObject result = new JSObject();
        result.put("declination", field.getDeclination());
        call.resolve(result);
    }
}
