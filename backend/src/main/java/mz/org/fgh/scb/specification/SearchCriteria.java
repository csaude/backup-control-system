package mz.org.fgh.scb.specification;

public class SearchCriteria {
	
	private String key;
    private String operation;
    private Object value;

    public SearchCriteria() {

    }

    public SearchCriteria(final String key, final String operation, final Object value) {
        super();
        this.key = key;
        this.operation = operation;
        this.value=value;	
        
        if(key.equals("canceled")&&value.equals("true")){
        	this.value = true;	
        }else if(key.equals("canceled")&&value.equals("false")){
        	this.value = false;
        }
        
        if(key.equals("enabled")&&value.equals("true")){
        	this.value = true;	
        }else if(key.equals("enabled")&&value.equals("false")){
        	this.value = false;
        }
        
        if(key.equals("openmrs_sql_dataset_uuid")){
        	this.value=value.toString().replaceAll("SPACEIFEN", "-");
        }
       
        
        if(key.equals("name")||key.equals("role")||key.equals("serial")||key.equals("version")||key.equals("status")){
        	this.value=value.toString().replaceAll("SPACE", " ");
        }
        
        if(key.equals("role")) {
        	this.value=this.value.toString().replaceAll("MEAME", "&");
        }
                
    }

    public String getKey() {
        return key;
    }

    public void setKey(final String key) {
        this.key = key;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(final String operation) {
        this.operation = operation;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(final Object value) {
        this.value = value;
    }


}
