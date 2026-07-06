-- LifeOS — seed data (Phase 0)
-- Run AFTER schema.sql and AFTER creating your user in Supabase Auth.
-- Replace the UUID below with your auth.users.id (also goes in LIFEOS_USER_ID).

do $$
declare
  uid uuid := 'REPLACE-WITH-YOUR-USER-ID';
  a_property uuid; a_wealth uuid; a_health uuid; a_people uuid;
  a_travel uuid; a_work uuid; a_home uuid; a_cars uuid;
  p_fitz uuid; p_radiator uuid; p_anacapri uuid; p_daw uuid;
begin
  -- Areas -------------------------------------------------------------------
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Property', '🏠', 1) returning id into a_property;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Wealth', '💷', 2) returning id into a_wealth;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Health', '❤️', 3) returning id into a_health;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'People', '👥', 4) returning id into a_people;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Travel', '✈️', 5) returning id into a_travel;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Work', '💼', 6) returning id into a_work;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Home (Anacapri)', '🌊', 7) returning id into a_home;
  insert into areas (user_id, name, icon, sort_order) values
    (uid, 'Cars', '🚗', 8) returning id into a_cars;

  -- Projects ----------------------------------------------------------------
  insert into projects (user_id, area_id, name, status, notes) values
    (uid, a_property, 'Fitzclarence House', 'active',
     'Purchase pipeline: Offer → Survey → Conveyancing → Exchange → Completion. Watch: Section 20 / Friel Welch works, lease terms.')
    returning id into p_fitz;
  insert into projects (user_id, area_id, name, status, notes) values
    (uid, a_property, 'Radiator project', 'active',
     'Constraints: leasehold consent, floor loading, boiler compatibility.')
    returning id into p_radiator;
  insert into projects (user_id, area_id, name, status, notes) values
    (uid, a_home, 'Anacapri maintenance', 'active',
     'Seasonal checklist: pre-summer and post-summer rounds. Local tradespeople in Contacts.')
    returning id into p_anacapri;
  insert into projects (user_id, area_id, name, status, notes) values
    (uid, a_work, 'DAW / carry issues', 'active',
     'Import the existing 12-item list as tasks here. Personal career items only — no firm, fund, LP or deal data.')
    returning id into p_daw;

  -- Fitzclarence pipeline stage tasks ----------------------------------------
  insert into tasks (user_id, project_id, area_id, title, notes, priority, created_via) values
    (uid, p_fitz, a_property, 'Stage: Offer — agreed & documented', 'Log offer history in project notes.', 2, 'system'),
    (uid, p_fitz, a_property, 'Stage: Survey — book RICS survey', 'Track survey fee in running costs.', 2, 'system'),
    (uid, p_fitz, a_property, 'Stage: Conveyancing — instruct solicitor', 'Chase Section 20 / Friel Welch documents.', 2, 'system'),
    (uid, p_fitz, a_property, 'Stage: Exchange', null, 1, 'system'),
    (uid, p_fitz, a_property, 'Stage: Completion', null, 1, 'system');

  -- Anacapri recurring seasonal tasks ----------------------------------------
  insert into tasks (user_id, project_id, area_id, title, due_date, recurrence_rule, created_via) values
    (uid, p_anacapri, a_home, 'Pre-summer maintenance round',
     (date_trunc('year', current_date) + interval '4 months')::date, 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=1', 'system'),
    (uid, p_anacapri, a_home, 'Post-summer maintenance round',
     (date_trunc('year', current_date) + interval '9 months')::date, 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=1', 'system');

  -- Contacts ----------------------------------------------------------------
  insert into contacts (user_id, name, relationship, context_notes, next_touch_due, linked_area) values
    (uid, 'Inaya', 'partner', null, null, a_people),
    (uid, 'Wedding photographer', 'vendor', 'Open item: digital photo delivery — chase.', current_date, a_people),
    (uid, 'Bala — Corinthian Travel', 'travel agent', 'Go-to for flight/trip bookings.', null, a_travel);

  -- Trips -------------------------------------------------------------------
  insert into trips (user_id, name, destination, status, checklist_json, notes) values
    (uid, 'Greek islands', 'Greece', 'idea',
     '[{"item":"Passports / docs","done":false},{"item":"Travel insurance","done":false},{"item":"Chargers & adapters","done":false},{"item":"Medication","done":false},{"item":"Sun cream & hats","done":false},{"item":"Swimwear","done":false}]',
     'First live trip record. Amalfi late-April notes archived here.');

  -- Car decision ---------------------------------------------------------------
  insert into decisions (user_id, area_id, name, options_json, criteria_json, status, notes) values
    (uid, a_cars, 'DB11 vs 911',
     '["Aston Martin DB11","Porsche 911"]',
     '[{"criterion":"Annual running cost","weight":3,"scores":{}},{"criterion":"Depreciation","weight":3,"scores":{}},{"criterion":"ULEZ","weight":2,"scores":{}},{"criterion":"Parking","weight":2,"scores":{}},{"criterion":"Joy","weight":3,"scores":{}}]',
     'open',
     'Converts to an ownership record (service/MOT/insurance renewal tasks) once purchased.');

  -- Habits ------------------------------------------------------------------
  insert into habits (user_id, name, schedule, notify_time, track_value, value_label) values
    (uid, 'Chess', 'daily', '21:30', true, 'rating'),
    (uid, 'Electrolytes', 'daily', null, false, null);
end;
$$;
