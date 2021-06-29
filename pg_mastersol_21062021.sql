--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0
-- Dumped by pg_dump version 12.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: 5cdf18_v_test; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."5cdf18_v_test" AS
 SELECT test.nombre,
    test.price,
    test.orderx
   FROM public.test
  WHERE (test.price >= (100)::numeric);


ALTER TABLE public."5cdf18_v_test" OWNER TO postgres;

--
-- Name: VIEW "5cdf18_v_test"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public."5cdf18_v_test" IS 'another view of mine';


--
-- Name: COLUMN "5cdf18_v_test".nombre; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."5cdf18_v_test".nombre IS 'Campo nombre';


--
-- Name: COLUMN "5cdf18_v_test".price; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."5cdf18_v_test".price IS 'Campo price!';


--
-- PostgreSQL database dump complete
--

