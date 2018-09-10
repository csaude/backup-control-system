/*
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
package mz.org.fgh.scb.specification;

import mz.org.fgh.scb.model.entity.IronkeyStatus;
import mz.org.fgh.scb.model.entity.ServerType;

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
        
        if(key.equals("type")&&value.equals("CHILD")){
        	this.value = ServerType.CHILD;	
        }else if(key.equals("type")&&value.equals("PARENT")){
        	this.value = ServerType.PARENT;
        }
        
        if(key.equals("status")&&value.equals("Activado")){
        	this.value = IronkeyStatus.Activado;	
        	System.out.println("AQUI");
        }else if(key.equals("status")&&value.equals("Desactivado")){
        	this.value = IronkeyStatus.Desactivado;
        }else if(key.equals("status")&&value.equals("Perdido")){
        	this.value = IronkeyStatus.Perdido;
        }else if(key.equals("status")&&value.equals("Problema")){
        	this.value = IronkeyStatus.Problema;
        }else if(key.equals("status")&&value.equals("Outro")){
        	this.value = IronkeyStatus.Outro;
        }
        
        if(key.equals("backupdate")){	
        	String str = new StringBuilder(this.value.toString()).insert(this.value.toString().length()-4, "-").toString();
        	this.value= new StringBuilder(str).insert(str.length()-2, "-").toString();
        }
        
        if(key.equals("starttime")){	
        	String str = new StringBuilder(this.value.toString()).insert(this.value.toString().length()-4, "-").toString();
        	this.value= new StringBuilder(str).insert(str.length()-2, "-").toString();
        }
        
        if(key.equals("canceled")&&value.equals("true")){
        	this.value = true;	
        }else if(key.equals("canceled")&&value.equals("false")){
        	this.value = false;
        }
        
        if(key.equals("received")&&value.equals("true")){
        	this.value = true;	
        }else if(key.equals("received")&&value.equals("false")){
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
       
        
        if(key.equals("name")||key.equals("role")||key.equals("serial")||key.equals("version")){
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
