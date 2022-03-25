<?php
$path = '../thumbnails';
$files=array_diff(scandir($path), array('..','.'));
natcasesort($files);
$keys = implode(",",$files);
echo $keys;
 ?>
