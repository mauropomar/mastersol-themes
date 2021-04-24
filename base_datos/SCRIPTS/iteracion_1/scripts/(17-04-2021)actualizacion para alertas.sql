drop table if exists security.users_alerts;
drop table if exists security.users_alerts_data;

CREATE TABLE alerts.users_alerts (
  id                uuid NOT NULL DEFAULT gen_random_uuid(),
  id_alerts_cfg     uuid NOT NULL,
  id_users          uuid NOT NULL,
  active            boolean NOT NULL DEFAULT true,
  imported          boolean NOT NULL DEFAULT false,
  orderx            serial NOT NULL,
  created           timestamp(6) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified          timestamp(6) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_organizations  uuid NOT NULL DEFAULT 'b37ac1cb-93db-435a-bb2a-76f6b2fef10e'::uuid,
  id_capsules       uuid NOT NULL DEFAULT '5cdf1800-af89-4ce0-8c9a-ef659b8891c5'::uuid,
  /* Keys */
  CONSTRAINT alerts_users_alerts_id_pk
    PRIMARY KEY (id),
  /* Foreign keys */
  CONSTRAINT alerts_users_alerts_capsules
    FOREIGN KEY (id_capsules)
    REFERENCES cfgapl.capsules(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE, 
  CONSTRAINT alerts_users_alerts_id_alerts_cfg_fk
    FOREIGN KEY (id_alerts_cfg)
    REFERENCES alerts.alerts_cfg(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE, 
  CONSTRAINT alerts_users_alerts_id_organizations_fk
    FOREIGN KEY (id_organizations)
    REFERENCES entities.organizations(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE, 
  CONSTRAINT alerts_users_alerts_id_users_fk
    FOREIGN KEY (id_users)
    REFERENCES "security".users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE UNIQUE INDEX alerts_users_alerts_id_alerts_cfg_id_users_pk
  ON alerts.users_alerts
  (id_alerts_cfg, id_users);

CREATE TRIGGER alerts_users_alerts_fn_default_field_active
  BEFORE INSERT
  ON alerts.users_alerts
  FOR EACH ROW
  EXECUTE PROCEDURE cfgapl.fn_default_field_active();

CREATE TRIGGER tr_alerts_users_alerts_fn_default_field_active
  BEFORE INSERT
  ON alerts.users_alerts
  FOR EACH ROW
  EXECUTE PROCEDURE cfgapl.fn_default_field_active();

CREATE TRIGGER tr_alerts_users_alerts_fn_generate_auditorias
  AFTER UPDATE OR INSERT OR DELETE
  ON alerts.users_alerts
  FOR EACH ROW
  EXECUTE PROCEDURE "security".fn_generate_auditorias();

ALTER TABLE alerts.users_alerts
  OWNER TO postgres;

COMMENT ON TABLE alerts.users_alerts
  IS 'Relations between Users and Alerts';