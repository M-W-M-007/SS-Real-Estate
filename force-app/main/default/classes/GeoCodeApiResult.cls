public class GeoCodeApiResult {
    
    public List<Result> results;
    public String status;
    
    public class Result{
        public List<AddressComponent> address_components;
        public String formatted_address;
        public Geometry geometry;
        public String place_id;
        public List<String> types;
    }
    
    public class AddressComponent{
        public String long_name;
        public String short_name;
        public List<String> types;
    }
    
    public class Bounds{
        public Northeast northeast;
        public Southwest southwest;
    }
    
    public class Geometry{
        public Bounds bounds;
        public Location location;
        public String location_type;
        public Viewport viewport;
    }
    
    public class Location{
        public double lat;
        public double lng;
    }
    
    public class Northeast{
        public double lat;
        public double lng;
    }
    
    
   
    
    public class Southwest{
        public double lat;
        public double lng;
    }
    
    public class Viewport{
        public Northeast northeast;
        public Southwest southwest;
    }
    
    
}