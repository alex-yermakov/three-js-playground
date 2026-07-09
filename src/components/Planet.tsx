import { TCelestialConfig } from '../objects/celestial';
import Celestial from './Celestial';

export default function Planet(props: { cfg: TCelestialConfig; map?: string }) {
  return <Celestial cfg={props.cfg} map={props.map} />;
}
